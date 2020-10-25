import React from "react";
import styled from "styled-components";

const ConfirmationMsg = ({ customerInformation }) => {
  // use the customerInformation (givenName, order and povince) to fill in the blanks in the confirmation message
  return (
    <Wrapper>
      Thanks for ordering, {customerInformation.givenName}! Your order of{" "}
      {customerInformation.order} will be sent to your home in{" "}
      {customerInformation.province}, Canada. Thank you for participating!
    </Wrapper>
  );
};

const Wrapper = styled.p`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  z-index: 4;
`;

export default ConfirmationMsg;
