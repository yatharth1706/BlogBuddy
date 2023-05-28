import Articles from "@/components/Articles";
import MyReadingList from "@/components/MyReadingList";
import NavigationBar from "@/components/NavigationBar";
import UserSuggestions from "@/components/UserSuggestions";

export default function Home() {
  return (
    <main className="flex h-screen flex-col py-2 justify-between">
      <div className="flex w-full h-screen px-8">
        <Articles />
        <div className="w-4/12 flex flex-col gap-8 p-8">
          <UserSuggestions />
          <MyReadingList />
        </div>
      </div>
    </main>
  );
}
