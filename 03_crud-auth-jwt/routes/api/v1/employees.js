import express from "express";

import {
  createNewEmployee,
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById
} from "../../../controllers/employeesController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(createNewEmployee)
  .patch(updateEmployeeById)
  .delete(deleteEmployeeById);

router.route("/:id").get(getEmployeeById);
export default router;
