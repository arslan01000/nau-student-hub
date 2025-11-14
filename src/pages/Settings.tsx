export default function Settings() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Settings page - Coming soon! This is a placeholder for future features like:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Profile customization</li>
            <li>Notification preferences</li>
            <li>Privacy settings</li>
            <li>Account management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}