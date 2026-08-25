import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";

export const space = " ";

export default function Footer(systemInfo) {
  const feedbackUrl = systemInfo?.systemInfo?.appFeedbackUrl;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
        <p>
          This app is a class project of{space}
          <a
            data-testid="footer-class-website-link"
            href="https://ucsb-cs156.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMPSC 156
          </a>
          {space}
          at
          {space}
          <a
            data-testid="footer-ucsb-link"
            href="https://ucsb.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            UCSB
          </a>
          . Check out the source code on
          {space}
          <a
            data-testid="footer-source-code-link"
            href={
              systemInfo?.systemInfo?.sourceRepo ||
              "https://github.com/ucsb-cs156/proj-courses"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          ! This is not an official source of UCSB course information. An
          official source can be found
          {space}
          <a
            data-testid="footer-course-search-link"
            href="https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
        <p>
          The cartoon Storke Tower images in the brand logo and favicon for this
          site were developed by Chelsea Lyon-Hayden, Art Director for UCSB
          Associate Students, and are used here by permission of the Executive
          Director of UCSB Associated Students. These images are Copyright ©
          2021 UCSB Associated Students, and may not be reused without express
          written permission of the Executive Director of UCSB Associated
          Students. For more info, visit:
          {space}
          <a
            data-testid="footer-sticker-link"
            href="https://www.as.ucsb.edu/sticker-packs"
          >
            www.as.ucsb.edu/sticker-packs/
          </a>
        </p>
        {feedbackUrl && (
          <>
            <Button
              data-testid="footer-feedback-button"
              onClick={() => setShowFeedbackModal(true)}
              variant="primary"
            >
              Provide Feedback
            </Button>
            <Modal
              show={showFeedbackModal}
              onHide={() => setShowFeedbackModal(false)}
              animation={false}
              data-testid="footer-feedback-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Provide Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Users with a UCSB Google Account are welcome to leave feedback
                  and make suggestions for improvements and new features. If the
                  following link doesn&apos;t work, try logging into your UCSB
                  Email/Google account in this browser first, and then try the
                  link again.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowFeedbackModal(false)}
                  data-testid="footer-feedback-modal-close-button"
                >
                  Cancel
                </Button>
                <Button
                  as="a"
                  data-testid="footer-feedback-modal-link"
                  href={feedbackUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="primary"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Open Feedback Form
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Container>
    </footer>
  );
}
