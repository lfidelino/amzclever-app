/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './PhraseFrequency.module.css';
import calculateHandler from './calculateHandler';

function PhraseFrequency() {
  const [calculating, setCalculating] = useState(false);
  const input = useRef();
  const replaceText = useRef();
  const withText = useRef();
  const defaultReplaceText = '/ \\ ^ $ * + ? ( ) | [ ] { }';

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    if (calculating) {
      calculateHandler(input.current.value, replaceText.current.value, withText.current.value);
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
          onClick={calculating ? null : () => {
            if (input.current.value !== '') setCalculating(true);
          }}
          disabled={calculating}
        >
          <span className={styles.ButtonText}>{calculating ? 'Calculating...' : 'Calculate'}</span>
          <i className="fas fa-calculator" />
        </Button>
        <div className={styles.ReplaceDiv}>
          Replace
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-bottom">Separate characters with a space.</Tooltip>}
          >
            <Form.Control
              className={styles.ReplaceText}
              size="sm"
              type="text"
              ref={replaceText}
              defaultValue={defaultReplaceText}
            />
          </OverlayTrigger>
          with
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id="tooltip-bottom">
                Leaving this blank will remove the characters.
              </Tooltip>
            )}
          >
            <Form.Control className={styles.WithText} size="sm" type="text" ref={withText} />
          </OverlayTrigger>
        </div>
      </Form.Group>
    </Container>
  );
}

export default PhraseFrequency;
