import React from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.css';


function Layout(props) {
  const { children } = props;
  return (
    <div className={styles.Layout}>
      HEADER
      {children}
      FOOTER
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
