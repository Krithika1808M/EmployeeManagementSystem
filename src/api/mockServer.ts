import { createServer, Model } from "miragejs";

export function startMockServer() {
  createServer({
    models: {
      employee: Model,
    },

    seeds(server) {
      server.create("employee", {
        id: "1",
        name: "Mark Hill",
        designation: "CEO",
        team: "Leadership",
        managerId: null,
      });

      server.create("employee", {
        id: "2",
        name: "Joe Linux",
        designation: "CTO",
        team: "Engineering",
        managerId: "1",
      });
      server.create("employee", {
        id: "3",
        name: "Sarah Connor",
        designation: "CFO",
        team: "Finance",
        managerId: "1",
      });
      server.create("employee", {
        id: "4",
        name: "Alice Johnson",
        designation: "COO",
        team: "Operations",
        managerId: "1",
      });

      server.create("employee", {
        id: "5",
        name: "Ron Blomquist",
        designation: "Engineering Manager",
        team: "Engineering",
        managerId: "2",
      });
      server.create("employee", {
        id: "6",
        name: "Michael Green",
        designation: "Operations Manager",
        team: "Operations",
        managerId: "4",
      });

      server.create("employee", {
        id: "7",
        name: "Dave Lister",
        designation: "Software Engineer",
        team: "Engineering",
        managerId: "5",
      });
      server.create("employee", {
        id: "8",
        name: "Emma Watson",
        designation: "Logistics Coordinator",
        team: "Operations",
        managerId: "6",
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/employees", (schema) => {
        return { employees: schema.all("employee").models };
      });

      this.patch("/employees/:id", (schema:any, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        return schema.find("employee", id)?.update(attrs);
      });
    },
  });
}


