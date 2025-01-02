import { render, screen}from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import Blog from '../components/Blog'
import { describe, vi } from "vitest";


describe("Blog list Test", () => {
    const blog = {
        title: "Testing blog component",
        author: "Akwesi-Bonah",
        url: 'http://akwesi-bona.com',
        likes: 5,
        user: {
            id: '1234',
            name: "Akwesi-Bona"
        }

    }


    const mockUpdateBlog = vi.fn()
    const mockDeleteBlog = vi.fn()
    const currentUser = {id: '123', name: "Akwesi-Bona"}

    test('Render Blog title and author by default', () => {

        render(
            <Blog
            blog={blog}
            updateBlog={mockUpdateBlog}
            deleteBlog={mockDeleteBlog}
            currentUser={currentUser}
            />
        )


        const titleAuthorElement = screen.getByText(`${blog.title} ${blog.author}`);
        expect(titleAuthorElement).toBeDefined();

        const urlElement = screen.queryByText(blog.url);
        expect(urlElement).toBeNull();
    
        const likesElement = screen.queryByText(`Likes: ${blog.likes}`);
        expect(likesElement).toBeNull();
    })

    test('shows URL and likes when the details are toggled', async () => {
        render(
          <Blog
            blog={blog}
            updateBlog={mockUpdateBlog}
            deleteBlog={mockDeleteBlog}
            currentUser={currentUser}
          />
        );
    
        const user = userEvent.setup();
        const viewButton = screen.getByText('View');
        await user.click(viewButton);
    
        const urlElement = screen.getByText(`URL: ${blog.url}`);
        expect(urlElement).toBeDefined();
    
        const likesElement = screen.getByText(`Likes: ${blog.likes}`);
        expect(likesElement).toBeDefined();
      });

      test('calls like button handler twice when clicked twice', async () => {
        render(
          <Blog
            blog={blog}
            updateBlog={mockUpdateBlog}
            deleteBlog={mockDeleteBlog}
            currentUser={currentUser}
          />
        );
    
        const user = userEvent.setup();
        const viewButton = screen.getByText('View');
        await user.click(viewButton);
    
        const likeButton = screen.getByText('Like');
        await user.click(likeButton);
        await user.click(likeButton);
    
        expect(mockUpdateBlog.mock.calls).toHaveLength(2);
    });

})