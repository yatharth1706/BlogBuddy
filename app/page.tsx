import Articles from "@/components/Articles";
import MyReadingList from "@/components/MyReadingList";
import NavigationBar from "@/components/NavigationBar";
import UserSuggestions from "@/components/UserSuggestions";

export default function Home() {
  return (
    <main className="flex h-auto bg-gray-100 flex-col p-2 justify-between">
      <NavigationBar />
      <div className="flex mx-auto bg-white w-11/12">
        <Articles />
        <div className="flex flex-col">
          <UserSuggestions />
          <MyReadingList />
        </div>
      </div>
    </main>
  );
}
