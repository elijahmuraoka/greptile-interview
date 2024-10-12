import Link from 'next/link';
import { auth } from '@/auth';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <div className="w-full flex-1 flex-col flex gap-8 justify-start items-center pt-12">
            <h1 className="text-2xl font-semibold">
                Welcome back! <br /> Here's an overview of your recent activity
                and available actions.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5">
                            <li>Generated changelog for Project A</li>
                            <li>Updated repository settings</li>
                            <li>Reviewed 3 changelogs</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between mb-2">
                            <span>Total Changelogs:</span>
                            <span className="font-semibold">27</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Repositories Connected:</span>
                            <span className="font-semibold">5</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Last Generation:</span>
                            <span className="font-semibold">2 days ago</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button>Generate New Changelog</Button>
                        <Button variant="outline">Connect Repository</Button>
                        <Button variant="outline">View All Changelogs</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
