export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 grid-pattern">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-serif mb-8">About NAU Student Hub</h1>
        <div className="space-y-6 text-base text-muted-foreground">
          <p>
            NAU Student Hub is a community-driven platform designed exclusively for North American University students.
            Our mission is to create a space where students can connect, share experiences, and support each other
            throughout their academic journey.
          </p>
          <p>
            Whether you're looking for honest professor reviews, seeking advice about internships and OPT/CPT,
            discussing campus life, or buying and selling textbooks, NAU Student Hub brings it all together in one
            clean, easy-to-use platform.
          </p>
          <p>
            Built by students, for students. We believe in the power of community and the value of shared knowledge.
            Every post, review, and discussion helps create a better experience for NAU students.
          </p>
          <div className="pt-8">
            <h2 className="text-2xl font-serif mb-4">What You Can Do Here</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-foreground mr-2">•</span>
                <span>Ask questions and get answers from fellow students</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-2">•</span>
                <span>Read and write honest professor and course reviews</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-2">•</span>
                <span>Share tips about internships, OPT, and CPT</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-2">•</span>
                <span>Buy and sell textbooks and items</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-2">•</span>
                <span>Connect with your NAU community</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}