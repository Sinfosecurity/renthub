export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-75"></div>
        <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  )
}
