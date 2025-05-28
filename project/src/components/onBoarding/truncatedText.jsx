import React from 'react';
import { Tooltip } from '@mui/material';

export const TruncatedText = ({ children, maxLength = 20 }) => {
  const text = typeof children === 'string' ? children : '';

  if (text.length > maxLength) {
    const truncatedText = text.slice(0, maxLength) + '...';
    return (
      <Tooltip title={text}>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: `${maxLength}ch`,
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          {truncatedText}
        </span>
      </Tooltip>
    );
  }

  return (
    <span
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: `${maxLength}ch`,
        display: 'inline-block',
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
};

export const EllipsisText = ({ children }) => {
  return (
    <span
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        width: '100%',
      }}
    >
      {children}
    </span>
  );
};

export const TruncatedTextShort = ({ children }) => {
  const text = typeof children === 'string' ? children : '';

  if (text.length > 8) {
    const truncatedText = text.slice(0, 8) + '...';
    return (
      <Tooltip title={text}>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '20ch',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          {truncatedText}
        </span>
      </Tooltip>
    );
  }

  return (
    <span
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '20ch',
        display: 'inline-block',
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
};
