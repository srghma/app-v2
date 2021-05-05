
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default
  }
}));

const S3fVault = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      S3f Vault Page
    </main>
  )
}

export default memo(S3fVault)