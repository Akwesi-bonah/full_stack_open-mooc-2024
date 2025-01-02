import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "../components/BlogForm";
import { describe } from "vitest";

describe("Blog form component test", async () => {
  test("calls createBlog with correct details when new blog is created", async () => {
    const mockCreateBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={mockCreateBlog} />);

    // Get input fields
    const titleInput = screen.getByPlaceholderText("title ....");
    const authorInput = screen.getByPlaceholderText("author ...");
    const urlInput = screen.getByPlaceholderText("url ....");
    const createButton = screen.getByRole("button", { name: /create/i });

    // fill out the form
    await user.type(titleInput, "The last Ship");
    await user.type(authorInput, "Akwesi-Bona");
    await user.type(urlInput, "http://akwesi-bona.com");

    // submit the form
    await user.click(createButton);

    // Assert that mockCreateBlog was called once with correct data
    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: "The last Ship",
      author: "Akwesi-Bona",
      url: "http://akwesi-bona.com",
    });
  });
});
