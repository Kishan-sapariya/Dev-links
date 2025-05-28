import './globals.css'

export const metadata = {
  title: 'DevLinks App',
  description: 'Link sharing app for developers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
