import {
  createNewEmployee,
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById
} from "../../../controllers/employeesController.js";

import ROLES_LIST from "../../../config/roles_list.js";
import express from "express";
import verifyRoles from "../../../middleware/verifyRoles.js";

const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployeeById)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployeeById);

router.route("/:id").get(getEmployeeById);
export default router;
