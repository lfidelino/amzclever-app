import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import styles from './CurrencyConverter.module.css';

function CurrencyConverter() {
  return (
    <Container>
      <Form.Label className={styles.FormLabel}>Currency Converter</Form.Label>
      <Container className={styles.Container} fluid="sm">
        asd
      </Container>
    </Container>
  );
}

export default CurrencyConverter;
