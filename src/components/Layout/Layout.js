import React from 'react';
import PropTypes from 'prop-types';
import NavigationBar from './NavigationBar/NavigationBar';
import styles from './Layout.module.css';


function Layout(props) {
  const { children } = props;
  return (
    <div className={styles.Layout}>
      <NavigationBar />
      <div className={styles.Children}>{children}</div>
      {/* FOOTER */}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
