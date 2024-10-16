import { Card, CardContent } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

const steps = [
  { title: "Add to cart", icon: <AddShoppingCartIcon /> },
  { title: "Payment", icon: <AttachMoneyIcon /> },
  { title: "Print Voucher", icon: <LocalPrintshopIcon /> },
];

const StepperComp = ({ activeStep, handleNext, handleBack, handleSkip, handleReset, isStepOptional, isStepSkipped }) => {


  return (
    <Card
      sx={{ border: "1px solid #f0f0f0", borderRadius: "10px" }}
      elevation={0}
    >
      <CardContent>
        {" "}
        <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} sx={{ overflowX: "auto" }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={index} {...stepProps}>
              <StepLabel {...labelProps}>
                <Box
                  sx={{
                    border: "1px solid grey",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    width: { xs: "80px", sm: "100px" }, // Adjust width based on screen size
                    minWidth: "80px", // Set minimum width
                    textAlign: "center", // Center content
                  }}
                >
                  {label.icon}
                  <Typography sx={{ mt: 0.5, fontWeight:'600', fontSize: { xs: "0.8rem", sm: "0.8rem" } }}>{label.title}</Typography> {/* Adjust font size based on screen size */}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

          {/* {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )} */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepperComp;
