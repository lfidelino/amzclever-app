/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './PhraseFrequency.module.css';
import calculateHandler from './calculateHandler';

function PhraseFrequency() {
  const [calculating, setCalculating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const input = useRef();
  const proxyText = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    if (calculating) {
      calculateHandler(input.current.value, proxyText.current.value);
      console.log();
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
        <Form.Control
          className={styles.ProxyText}
          size="sm"
          type="text"
          ref={proxyText}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        />
        <Overlay target={proxyText} show={showTooltip} placement="left">
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              Replace special characters with...
            </Tooltip>
          )}
        </Overlay>
      </Form.Group>
    </Container>
  );
}

export default PhraseFrequency;
