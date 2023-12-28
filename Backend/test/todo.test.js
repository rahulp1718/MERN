const request = require("supertest");
const server = require("../server");

describe("Todo API", () => {
  const sampleTodo = {
    text: "TestTodo",
    assignes: "rahul",
  };

  let createdTodoId;

  test("post /todos", async () => {
    const response = await request(server).post("/todos").send(sampleTodo);
    expect(200);

    createdTodoId = response.body._id;

    expect(response.body.text).toBe(sampleTodo.text);
    expect(response.body.assignes).toBe(sampleTodo.assignes);
    expect(response.body.done).toBe(false);
  });

  test("GET /todos - Get all todos", () => {
    const response = request(server).get("/todos").expect(200);
  });

  test("PUT /todos/:id - Update a todo", async () => {
    const updatedTodo = {
      assignes: "john",
    };

    const response = await request(server)
      .put(`/todos/${createdTodoId}`)
      .send(updatedTodo)
      .expect(200);

    expect(response.body.message).toBe("Updated successfully");
    expect(response.body.data.assignes).toEqual(updatedTodo.assignes);
  });

  test("DELETE /todos/:id - Delete a todo", async () => {
    const response = await request(server)
      .delete(`/todos/${createdTodoId}`)
      .expect(200);

    expect(response.body.message).toBe("Todo deleted successfully");
    expect(response.body.data._id).toBe(createdTodoId);
  }, 10000);
});
