"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddEventModal,
  closeDeleteModal,
  openAddEventModal,
  openDeleteModal,
} from "@/redux/slices/modalSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/components/modals/DeleteModal";
import Header from "@/components/Header";
import { redirect, useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import {
  closeLoadingScreen,
  openLoadingScreen,
} from "@/redux/slices/loadingSlice";
import { onAuthStateChanged } from "firebase/auth";
import { signInUser } from "@/redux/slices/userSlice";
import { auth } from "@/firebase";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Home() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(openLoadingScreen());
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      //Handle redux actions
      dispatch(
        signInUser({
          name: currentUser.displayName!,
          username: currentUser.email!.split("@")[0],
          email: currentUser.email!,
          uid: currentUser.uid,
          events: [],
        })
      );
      setAuthChecked(true);
      dispatch(closeLoadingScreen());
    });

    return unsubscribe;
  }, []);

  const [events, setEvents] = useState([
    { title: "event 1", id: "1" },
    { title: "event 2", id: "2" },
    { title: "event 3", id: "3" },
    { title: "event 4", id: "4" },
    { title: "event 5", id: "5" },
  ]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    dispatch(openAddEventModal());
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime(),
    };
    setAllEvents([...allEvents, event]);
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    dispatch(openDeleteModal());
    setIdToDelete(Number(data.event.id));
  }

  return (
    <>
      <LoadingScreen />
      <Header loggedIn={true} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWeek, dayGridMonth timeGridWeek",
              }}
              events={allEvents}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClicked={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
              }}
            />
          </div>
          <div
            id="draggable-el"
            className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50"
          >
            <h1 className="font-bold text-lg text-center">Drag Event</h1>
            {events.map((event) => (
              <div
                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white hover:cursor-pointer"
                title={event.title}
                key={event.id}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
        <DeleteModal />
      </main>
    </>
  );
}
