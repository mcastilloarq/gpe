import React from 'react';
import { makeStyles, IconButton, colors } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  copy: {
    // color: colors.blue[600]
  },
  copied: {
    color: colors.green[600]
  }
}));

export default function CopyContent({ paperClip, onCopyContent, content }) {
  const classes = useStyles();

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    onCopyContent(content);
  };

  return (
    <IconButton aria-label="copy-content"
      className={paperClip === content ? classes.copied : classes.copy}
      onClick={copyContent}
    >
      {paperClip === content ?
        <CheckIcon fontSize="small" /> :
        <CopyIcon fontSize="small" />
      }
    </IconButton>
  );
}
