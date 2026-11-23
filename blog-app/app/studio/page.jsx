import Studio from "../../components/Studio";
export const metadata = {
  title: "本機內容編輯器",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  return process.env.NEXT_PUBLIC_LOCAL_STUDIO === "true" ? (
    <Studio />
  ) : (
    <div className="local-only">
      <p className="eyebrow">LOCAL MARKDOWN STUDIO</p>
      <h1>內容編輯器在本機開啟。</h1>
      <p>
        在 blog-app 目錄執行下方指令，再開啟本機的 /studio/，就能編輯 Markdown
        與 Roadmap。
      </p>
      <code>npm run dev</code>
      <p>文章與學習路線儲存在 content/，更新後重新建置即可發佈。</p>
    </div>
  );
}
