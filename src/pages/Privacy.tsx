export default function Privacy() {
  return (
    <div className="min-h-screen py-8 px-4 grid-pattern">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy & Anonymity</h1>
        
        <div className="space-y-6 text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Our Commitment to Your Privacy</h2>
            <p>
              NAU Threads is an unofficial, student-run platform designed to help NAU students 
              share information and experiences. We take your privacy seriously.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Why We Require Login</h2>
            <p>
              We use basic login to reduce spam and abuse, and to keep the community safe. 
              This helps us maintain a quality platform where real students can help each other.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">How Anonymity Works</h2>
            <p>
              When you choose to post or review anonymously:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your name and email are <strong>never shown publicly</strong></li>
              <li>Your post or review displays as "Anonymous" to all other users</li>
              <li>We keep an internal ID for moderation and safety purposes only</li>
              <li>No one else can see your identity on anonymous content</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">What Information We Store</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email address:</strong> Used for login and account recovery</li>
              <li><strong>Display name (optional):</strong> Shown on non-anonymous posts</li>
              <li><strong>User ID:</strong> Internal identifier for moderation</li>
              <li><strong>Posts, reviews, and replies:</strong> Content you create</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Non-Anonymous Posts</h2>
            <p>
              If you choose not to post anonymously:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your display name will be shown (if you've set one)</li>
              <li>If no display name is set, an obfuscated version of your email will appear (e.g., "user***@example.com")</li>
              <li>Other users can see your public activity</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Moderation & Safety</h2>
            <p>
              While we protect your anonymity from other users, platform moderators may access 
              user IDs to handle violations, spam, harassment, or other safety concerns. 
              We only use this information to maintain a safe and respectful community.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Questions?</h2>
            <p>
              If you have questions about privacy or anonymity, please visit our Contact page.
            </p>
          </section>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Remember:</strong> NAU Threads is unofficial and student-run. 
              This is not affiliated with North American University (NAU). 
              Always verify important information with official NAU resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
