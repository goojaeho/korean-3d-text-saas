export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Korean 3D Text SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            한글 3D 텍스트 생성 플랫폼
          </p>
          <div className="max-w-md mx-auto">
            <a 
              href="/editor"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              3D 텍스트 에디터 시작하기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
