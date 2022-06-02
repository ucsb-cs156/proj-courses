import { Container } from "react-bootstrap";

export const space=" ";

export default function Footer() {
  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
      <p>
      This app is a class project of{space}
      <a
        href="https://ucsb-cs156.github.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        CMPSC 156
      </a>
      {space}
      at
      {space}
      <a href="https://ucsb.edu" target="_blank" rel="noopener noreferrer">
        UCSB
      </a>
      . Check out the source code on
      {space}
      <a
        href="https://github.com/ucsb-cs156-s22/s22-4pm-courses"
        target="_blank"
        rel="noopener noreferrer"
      >
      GitHub
      </a>
      !
      This is not an official source of UCSB course information. An official
      source can be found
      {space}
      <a
        href="https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
      </p>
      <p>
        The cartoon Storke Tower images in the brand logo and favicon for this site were
        developed by Chelsea Lyon-Hayden, Art Director for UCSB Associate Students, and are
        used here by permission of the Executive Director of UCSB Associated Students.
        These images are Copyright © 2021 UCSB Associated Students, and may not be reused
        without express written permission of the Executive Director of UCSB Associated Students.  For more info, visit: 
        {space}
        <a href="https://www.as.ucsb.edu/sticker-packs/>">www.as.ucsb.edu/sticker-packs/</a>
      </p>
      </Container>
    </footer>
  );
}