const PrivacyPage = () => {
  return <div className="flex flex-col gap-4 p-8 w-5xl max-w-5xl mx-auto">
    <h1 className="text-4xl font-display">Privacy Policy</h1>
    <p>Last Updated: December 19, 2024</p>
    <h2 className="text-lg font-display">1. Introduction</h2>
    <p>This Privacy Policy explains how Beat Last Year ("we", "our", or "the App") collects, uses, and protects your data.</p>
    <h2 className="text-lg font-display">2. Information We Collect</h2>
    <p>We collect:</p>
    <ul className="list-disc pl-4">
      <li>Basic Strava profile information (name, athlete ID)</li>
      <li>Running activity data from Strava</li>
      <li>Authentication tokens for Strava API access</li>
      <li>Running performance metrics</li>
    </ul>
    <h2 className="text-lg font-display">3. How We Use Your Information</h2>
    <p>We use your data to:</p>
    <ul className="list-disc pl-4">
      <li>Analyze your 5K running times</li>
      <li>Track your yearly progress</li>
      <li>Display your personal bests</li>
      <li>Maintain and improve the service</li>
    </ul>
    <h2 className="text-lg font-display">4. Data Storage and Security</h2>
    <ul className="list-disc pl-4">
      <li>Data is stored securely using Supabase</li>
      <li>Authentication tokens are encrypted</li>
      <li>We implement industry-standard security measures</li>
      <li>We regularly review and update our security practices</li>
    </ul>
    <h2 className="text-lg font-display">5. Data Sharing</h2>
    <p>We do not:</p>
    <ul className="list-disc pl-4">
      <li>Sell your personal data</li>
      <li>Share your data with third parties</li>
      <li>Use your data for advertising</li>
      <li>Access more Strava data than necessary</li>
    </ul>
    <h2 className="text-lg font-display">6. Your Rights</h2>
    <p>You have the right to:</p>
    <ul className="list-disc pl-4">
      <li>Access your stored data</li>
      <li>Request data correction</li>
      <li>Request data deletion</li>
      <li>Revoke Strava access</li>
      <li>Export your data</li>
    </ul>
    <h2 className="text-lg font-display">7. Data Retention</h2>
    <ul className="list-disc pl-4">
      <li>Data is stored while your account is active</li>
      <li>Data is deleted upon account termination</li>
      <li>You can request data deletion at any time</li>
      <li>Backup copies may be retained briefly for technical purposes</li>
    </ul>
    <h2 className="text-lg font-display">8. Third-Party Services</h2>
    <p>We use:</p>
    <ul className="list-disc pl-4">
      <li>Strava API for activity data</li>
      <li>Supabase for data storage</li>
      <li>Each service has its own privacy policy</li>
    </ul>
    <h2 className="text-lg font-display">9. Cookies and Tracking</h2>
    <ul className="list-disc pl-4">
      <li>We use essential cookies for authentication</li>
      <li>No third-party tracking cookies</li>
      <li>No advertising cookies</li>
    </ul>
    <h2 className="text-lg font-display">10. Children's Privacy</h2>
    <p>The App is not intended for users under 13 years of age.</p>
    <h2 className="text-lg font-display">11. Changes to Privacy Policy</h2>
    <p>We will notify users of significant changes to this policy.</p>
    <h2 className="text-lg font-display">12. Contact Information</h2>
    <p>For privacy concerns, contact beatlastyearxyz@gmail.com</p>
  </div>
}

export default PrivacyPage
