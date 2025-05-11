const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post("http://localhost:3001/api/testing/reset");

    // Create a test user
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Akwesi Bona",
        username: "Akwesi",
        password: "Bona",
      },
    });

    // Navigate to the application
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // Ensure the login form is visible
    const loginForm = page.locator(".loginForm");
    await expect(loginForm).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      // Fill in valid credentials
      await page.getByRole("textbox").first().fill("Akwesi");
      await page.getByRole("textbox").last().fill("wrongPassword");

      // Submit the form
      await page.getByRole("button", { name: "login" }).click();

      // Verify successful login
      await expect(page.getByText("Akwesi Bona logged in")).toBeVisible();
    });

    test("fails with wrong password", async ({ page }) => {
      // Fill in invalid credentials
      await page.getByRole("textbox").first().fill("Akwesi");
      await page.getByRole("textbox").last().fill("Bona");

      // Submit the form
      await page.getByRole("button", { name: "login" }).click();

      // Verify error message is displayed
      const errorMessage = page.getByText("An Error Occurred");
      await expect(errorMessage).toBeVisible();

      // Ensure the login form is still visible
      const loginForm = page.locator(".loginForm");
      await expect(loginForm).toBeVisible();
    });
  });

  test("a new blog can be created", async ({ page }) => {
    await page.getByRole("button", { name: "new blog" }).click();

    await page.getByTestId("title").fill("Test Blog");
    await page.getByTestId("author").fill("Author Name");
    await page.getByTestId("url").fill("http://testblog.com");

    await page.getByRole("button", { name: "create" }).click();

    await expect(page.getByText("Test Blog - Author Name")).toBeVisible();
  });

  test("a blog can be liked", async ({ page }) => {
    await page
      .getByText("Test Blog - Author Name")
      .getByRole("button", { name: "view" })
      .click();

    await page.getByRole("button", { name: "like" }).click();

    const likeCount = await page.getByTestId("likes-count");
    await expect(likeCount).toHaveText("1");
  });

  test("the user who added the blog can delete it", async ({ page }) => {
    await page
      .getByText("Test Blog - Author Name")
      .getByRole("button", { name: "view" })
      .click();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole("button", { name: "delete" }).click();

    await expect(page.getByText("Test Blog - Author Name")).not.toBeVisible();
  });

  test("only the user who added the blog sees the delete button", async ({
    page,
    request,
  }) => {
    await page.getByRole("button", { name: "logout" }).click();
    await request.post("http://localhost:3001/api/users", {
      data: {
        username: "newuser",
        password: "newpassword",
      },
    });
    await page.getByTestId("username").fill("newuser");
    await page.getByTestId("password").fill("newpassword");
    await page.getByRole("button", { name: "login" }).click();

    await page
      .getByText("Test Blog - Author Name")
      .getByRole("button", { name: "view" })
      .click();
    await expect(
      page.getByRole("button", { name: "delete" })
    ).not.toBeVisible();
  });

  test("blogs are ordered by likes", async ({ page }) => {
    await page
      .getByText("First Blog - Author Name")
      .getByRole("button", { name: "view" })
      .click();
    await page.getByRole("button", { name: "like" }).click();
    await page.getByRole("button", { name: "like" }).click();

    await page
      .getByText("Second Blog - Author Name")
      .getByRole("button", { name: "view" })
      .click();
    await page.getByRole("button", { name: "like" }).click();

    const blogs = await page.locator(".blog");
    const blogTexts = await blogs.allTextContents();
    expect(blogTexts).toEqual([
      "First Blog - Author Name",
      "Second Blog - Author Name",
      
    ]);
  });
});
