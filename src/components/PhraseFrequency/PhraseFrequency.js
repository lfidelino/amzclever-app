import React, { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './PhraseFrequency.module.css';
import calculateHandler from './calculateHandler';

function PhraseFrequency() {
  const [calculating, setCalculating] = useState(false);
  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    if (calculating) {
      calculateHandler(input.current.value);
      setCalculating(false);
    }
  }, [calculating]);

  return (
    <Container>
      <Form.Group controlId="phraseFrequency">
        <Form.Label className={styles.FormLabel}>Phrase Frequency Calculator</Form.Label>
        <Form.Control as="textarea" rows="24" ref={input} />
        <Button
          block
          onClick={calculating ? null : () => setCalculating(true)}
          disabled={calculating}
        >
          <span className={styles.ButtonText}>{calculating ? 'Calculating...' : 'Calculate'}</span>
          <i className="fas fa-calculator" />
        </Button>
      </Form.Group>
    </Container>
  );
}

export default PhraseFrequency;
