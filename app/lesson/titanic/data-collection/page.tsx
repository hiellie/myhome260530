import { LessonDataCollectionUpload } from "@/components/lesson/LessonDataCollectionUpload";

export default function LessonTitanicDataCollectionPage() {
  return (
    <>
      <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        Lesson · Titanic
      </p>
      <h1 className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-neutral-900">
        1. 데이터 수집
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
        캐글(Kaggle)에서 다운로드한 Titanic CSV를 업로드합니다. 수집된 데이터는
        이후 Neon DB에 적재하는 단계로 이어집니다.
      </p>
      <LessonDataCollectionUpload />
    </>
  );
}
