import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function TestJobForm({ submitAction }) {

 const defaultValues = {
    fail: false,
    sleepMs: 1000
};

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm(
    { defaultValues: defaultValues }
  );
  // Stryker enable all

  const testid = "TestJobForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor="fail">Fail? (if checked, job will fail, to test error handling)</Form.Label>
        <Form.Check 
          data-testid={`${testid}-fail`}
          type="checkbox"
          id="fail"
          {...register("fail")}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="sleepMs">Sleep (milliseconds)</Form.Label>
        <Form.Control
          id="sleepMs"
          data-testid={`${testid}-sleepMs`}
          type="number"
          step="100"
          isInvalid={!!errors.sleepMs}
          {...register("sleepMs", {
            valueAsNumber: true,
            required: "sleepMs is required (0 is ok)",
            min: { value: 0, message: "sleepMs must be positive" },
            max: { value: 60000, message: "sleepMs may not be > 60000 (1 minute)" },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.sleepMs?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid="TestJobForm-Submit-Button">Submit</Button>
    </Form>
  );
}

export default TestJobForm;
