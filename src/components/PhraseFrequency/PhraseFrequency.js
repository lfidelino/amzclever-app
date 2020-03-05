import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './PhraseFrequency.module.css';

function PhraseFrequency() {
  return (
    <Container>
      <Form.Group controlId="phraseFrequency">
        <Form.Label className={styles.FormLabel}>Phrase Frequency Calculator</Form.Label>
        <Form.Control as="textarea" rows="24" />
        <Button block>
          <span className={styles.ButtonText}>Calculate</span>
          <i className="fas fa-calculator" />
        </Button>
      </Form.Group>
    </Container>
  );
}

export default PhraseFrequency;
