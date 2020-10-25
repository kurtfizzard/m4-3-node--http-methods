import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductImage from "./ProductImage";
import Form from "./Form";
import ConfirmationMsg from "./ConfirmationMsg";
import ErrorMsg from "./ErrorMsg";

import { errorMessages, initialState } from "../settings";

const App = () => {
  const [formData, setFormData] = useState(initialState);
  const [disabled, setDisabled] = useState(true);
  const [subStatus, setSubStatus] = useState("idle");
  const [errMessage, setErrMessage] = useState("");
  // create a new useState that will represent customerData (an empty objet by default)
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    Object.values(formData).includes("") || formData.order === "undefined"
      ? setDisabled(true)
      : setDisabled(false);
  }, [formData, setDisabled]);

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrMessage("");
  };

  const handleClick = (event) => {
    event.preventDefault();
    setSubStatus("pending");

    fetch("/order", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // we need to fetch data in addition to status and error that we were fetching before
        const { status, error, data } = json;
        if (status === "success") {
          setSubStatus("confirmed");
          // call setCustomerData and use the data we fetched from the back end
          // that we originally received from the customer input
          setCustomerData(data);
        } else if (error) {
          setSubStatus("error");
          setErrMessage(errorMessages[error]);
        }
      });
  };

  return (
    <Wrapper>
      {subStatus !== "confirmed" ? (
        <>
          <ProductImage image={formData.order} />
          <Form
            formData={formData}
            handleChange={handleChange}
            handleClick={handleClick}
            disabled={disabled}
            subStatus={subStatus}
          />
          {subStatus === "error" && <ErrorMsg>{errMessage}</ErrorMsg>}
        </>
      ) : (
        // pass the customerData we fetched from the back end to ConfirmationMsg
        <ConfirmationMsg customerInformation={customerData} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f6f7fc;
  border-radius: 4px;
  box-shadow: 0 60px 120px rgba(71, 69, 123, 0.24),
    0 15px 35px rgba(71, 69, 123, 0.24);
  width: 340px;
  padding-bottom: 14px;
`;

export default App;
