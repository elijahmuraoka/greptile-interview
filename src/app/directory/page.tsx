import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Directory() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Changelog Directory</h1>
            <div className="mb-8">
                <Input
                    type="search"
                    placeholder="Search changelogs..."
                    className="max-w-md"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    'React',
                    'Next.js',
                    'TailwindCSS',
                    'TypeScript',
                    'Node.js',
                    'Express',
                ].map((project) => (
                    <div
                        key={project}
                        className="border border-border rounded-lg p-4 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            {project}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Latest updates and changes for {project}.
                        </p>
                        <Button variant="outline">View Changelog</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
