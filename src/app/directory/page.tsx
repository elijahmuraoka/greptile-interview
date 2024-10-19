import { getAllChangelogsAction } from '@/actions/changelogActions';
import DirectorySearchGrid from './components/directory-search-grid';
import { getUserByIdAction } from '@/actions/userActions';

export default async function Directory() {
  const changelogs = await getAllChangelogsAction();

  const changelogsWithUser = await Promise.all(
    changelogs.map(async (changelog) => {
      const user = await getUserByIdAction(changelog.userId);
      return { ...changelog, user };
    })
  );

  return (
    <div className="w-full flex flex-col items-center justify-center h-full flex-1 pt-8 space-y-8">
      <h1 className="text-3xl font-semibold w-full text-center">
        See Changelogs Made by the Community! 🎉
      </h1>
      <DirectorySearchGrid changelogs={changelogsWithUser} />
    </div>
  );
}
