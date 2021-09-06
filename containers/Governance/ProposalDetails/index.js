
import { memo, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'react-feather'

import { useVoteContract } from 'contexts/vote-context'
import LinkButton from 'components/UI/Buttons/LinkButton'
import PageHeader from 'parts/PageHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import ProposalHistory from 'parts/Vote/ProposalVoteHistory'
import ProposalDetailHeader from './ProposalDetailHeader'
import ProposalAction from './ProposalAction'
import ProposalDetailInfo from './ProposalDetailInfo'
import ProposalMetaInfo from './ProposalMetaInfo'
import { isEmpty } from 'utils/helpers/utility'
import LINKS from 'utils/constants/links'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
    marginTop: theme.spacing(2)
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'unset'
  }
}));

const ProposalDetails = () => {
  const classes = useStyles();
  const router = useRouter();
  const { proposals, getProposalReceipt } = useVoteContract();
  const [proposalReceipt, setProposalReceipt] = useState({});

  const proposal = useMemo(() => proposals.find((proposal) => proposal.index === parseInt(router.query.proposal, 10))
    , [router.query.proposal, proposals]);

  useEffect(() => {
    const getReceipt = async () => {
      const proposalReceipt = await getProposalReceipt(proposal.offset)
      setProposalReceipt(proposalReceipt);
    }

    if (!isEmpty(proposal)) {
      getReceipt()
    }
  }, [proposal, getProposalReceipt, setProposalReceipt]);

  return (
    <main className={classes.root}>
      <PageHeader
        title='Governance'
        subHeader='Use xSNOB to Proposal for proposals'
      />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <LinkButton className={classes.backLink} href={LINKS.GOVERNANCE.HREF}>
            <ArrowLeft size={20} /> Go back to all proposals
          </LinkButton>
        </Grid>
        {!isEmpty(proposal) &&
          <>
            <Grid item xs={12} md={8}>
              <ProposalDetailHeader proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <XSnowballCard />
            </Grid>
            <Grid item xs={12}>
              <ProposalHistory
                proposal={proposal}
                proposalReceipt={proposalReceipt}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProposalAction action='For' proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProposalAction action='Against' proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={8}>
              <ProposalDetailInfo proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProposalMetaInfo proposal={proposal} />
            </Grid>
          </>
        }
      </Grid>
    </main>
  )
}

export default memo(ProposalDetails)