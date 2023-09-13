import MasterBankController from "../controllers/MasterBankController";
import BaseRoutes from "./BaseRouter";

class MasterBankRoutes extends BaseRoutes {

    public routes(): void {
        this.router.get("/", MasterBankController.index);
        this.router.post("/", MasterBankController.create);
        this.router.get("/:id", MasterBankController.show);
        this.router.put("/:id", MasterBankController.update);
        this.router.delete("/:id", MasterBankController.delete);
    }
}

export default new MasterBankRoutes().router;