import Image from "next/image";

interface BlogAuthorCardProps {
  author: {
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
  };
}

export default function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  return (
    <div className="mt-10 pt-6 border-t bg-gray-50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tác giả: {author.name}
          </h3>
          {author.bio ? (
            <p className="text-gray-600 mt-2">{author.bio}</p>
          ) : (
            <p className="text-gray-600 mt-2">
              Người sáng tạo nội dung với niềm đam mê chia sẻ kiến thức và kinh nghiệm.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}