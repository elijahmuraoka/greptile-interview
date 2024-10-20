# RepLog AI: Intelligent Changelog Automation

RepLog AI is a Next.js application that leverages AI to generate comprehensive changelogs based on repository commit history. This tool aims to simplify the process of creating and maintaining changelogs for developers, making it easier to communicate changes to both technical and non-technical audiences.

## Features

- AI-powered changelog generation based on commit messages and pull requests
- User authentication with GitHub OAuth
- Repository selection and timeframe customization
- Interactive changelog editing for customization
- Public changelog directory for sharing with others and discovering new projects
- Responsive design

## Technical Stack

- **Frontend**: Next.js 14 with React 18
- **Backend**: Next.js API routes (serverless functions)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with GitHub provider
- **AI Integration**: OpenAI GPT-4
- **Styling**: Tailwind CSS with Radix UI components
- **Animation**: Framer Motion
- **Version Control**: Git and GitHub

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/replog-ai.git
   cd replog-ai
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_random_string_for_nextauth
   GITHUB_ID=your_github_oauth_app_client_id
   GITHUB_SECRET=your_github_oauth_app_client_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up the database:

   ```
   npx drizzle-kit push:pg
   ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Key Design Decisions

### User-Centered Design

1. **Minimalist Multi-step Changelog Generation**: I implemented an easy three-step process (repository selection, editing, and finalization) to guide users through changelog creation, making it less overwhelming and more intuitive.

2. **Interactive Editing**: Users can easily edit generated changelogs, add/remove entries, and customize content to ensure accuracy and relevance. Of course, I implemented an undo feature as well to prevent any accidental changes!

3. **Public Directory**: A browsable directory of public changelogs encourages sharing and discovery within the developer community.

### Technical Decisions

1. **Next.js and React**: Chosen for its server-side rendering capabilities, API routes, and seamless integration with React, providing a fast and SEO-friendly application. Next.js with Server Actions on top of Vercel is also extremely easy to deploy and is very affordable.

2. **Drizzle ORM and Postgres**: I chose Drizzle ORM because I wanted to try out a new technology and it has a very easy to use CLI for migrations. Postgres was chosen because it is a very reliable and featureful database that is easy to setup and is very performant.

3. **OpenAI GPT-4 Integration**: Utilized for generating human-readable changelogs from commit and pull request data, significantly reducing the manual effort required in changelog creation.

4. **NextAuth.js with GitHub OAuth**: Implemented for secure user authentication and easy access to repository data, streamlining the user onboarding process.

5. **Tailwind CSS and Shadcn UI**: Chosen for rapid UI development, consistent styling, and accessible components, resulting in a polished and responsive user interface.

6. **Framer Motion**: Integrated for smooth animations and transitions, enhancing the overall user experience and providing visual feedback for actions.

## Potential Future Enhancements

- Integration with additional version control platforms (e.g., GitLab, Bitbucket)
- Advanced AI fine-tuning for more accurate and context-aware changelog generation
- Team collaboration features for shared repositories
- Automated repository tracking and changelog publishing to various platforms (e.g., GitHub releases, Slack, email)

## Challenges and Learnings

During the development of RepLog AI, I encountered several significant challenges that provided valuable learning experiences:

### Version Compatibility and Database Integration

I initially selected Supabase for the database but encountered numerous version conflicts with other technologies. Switching to Vercel Postgres resolved these issues and provided better integration with Next.js. This experience highlighted the importance of thoroughly researching potential technology stack conflicts before committing to a particular setup.

### OAuth Implementation

Implementing OAuth, even with NextAuth, proved to be more complex than anticipated. Through persistent effort and trying various approaches, I eventually achieved a working solution. This process deepened my understanding of authentication flows and emphasized the need to allocate more time for authentication setup in future projects.

### Performance Limitations with Large Repositories

The system encountered issues before with large repositories due to Vercel's 60-second edge function timeout limit. To address this, I optimized the AI prompt for better commit grouping. However, if I needed to handle larger repositories in the future, I would plan to implement pagination, explore background job processing, or consider serverless solutions with longer timeout limits or just running an EC2 instance.

### Architectural Planning

I found myself making significant architectural changes late in the development process due to evolving requirements and insights. This experience underscored the value of thorough initial planning. In future projects, I intend to invest more time in creating detailed wireframes, user flow diagrams, and overall design before beginning implementation. However, I do believe in the importance of not over-planning and being able to adapt to changing requirements since you can't realisticallypredict everything.

### AI Prompt Engineering

Crafting effective prompts for the AI to generate meaningful changelogs from diverse commit data required significant iteration. I learned to balance specificity with flexibility in prompts and to account for various edge cases in data inputs. This process improved my skills in prompt engineering and AI integration.

### State Management in Complex UI Components

```typescript
export default function Changelog({
  changelog,
  changelogHistory,
  isOwner,
  inModal,
  onChangelogUpdate,
  onUndo,
}: ChangelogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // ... other state variables and logic
}
```

Managing state and props in intricate UI components, particularly in the changelog editing interface, became increasingly complex as the application grew and more frustrating towards the end. While I knew this would be a smaller project, I implemented a solution using local state and prop drilling. However, for future projects involving complex state management, I would consider using a more robust solution like Redux or Zustand from the outset.

Altogether, these challenges improved RepLog AI in addition to my skills, emphasizing the importance of thorough planning, up-to-date practices, and adaptability in development.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback about RepLog AI, please feel free to reach out to me via email at [elijahmuraoka.services@gmail.com](mailto:elijahmuraoka.services@gmail.com).

Thank you for reading! 🙏

---

_RepLog AI - Simplifying Changelog Generation with AI_

[GitHub](https://github.com/elijahmuraoka/RepLog-AI) | [Live Demo](https://replog-ai.vercel.app/)
