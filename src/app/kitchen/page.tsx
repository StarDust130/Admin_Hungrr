// "use client";

// import { useState, useEffect, useMemo, FC } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Clock,
//   Utensils,
//   CheckCircle,
//   ChefHat,
//   Salad,
//   Timer,
//   PartyPopper,
//   Bell,
//   Sparkles,
//   Inbox,
// } from "lucide-react";
// import { io, Socket } from "socket.io-client";

// // ====================================================================
// //  Type Definitions
// // ====================================================================
// interface OrderItem {
//   id: number;
//   quantity: number;
//   item: { id: number; name: string };
//   variant?: { id: number; name: string };
// }

// interface Order {
//   id: number;
//   publicId: string;
//   tableNo: number;
//   cafeId: number;
//   status: "accepted" | "preparing" | "ready" | "completed";
//   created_at: string;
//   order_items: OrderItem[];
//   prepTime?: number;
// }

// // ====================================================================
// //  Timer Component
// // ====================================================================
// const TimerComponent: FC<{ prepTime: number; status: Order["status"] }> = ({
//   prepTime,
//   status,
// }) => {
//   const [timeLeft, setTimeLeft] = useState(prepTime * 60);

//   useEffect(() => {
//     if (status !== "preparing" || timeLeft <= 0) return;
//     const timer = setInterval(
//       () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)),
//       1000
//     );
//     return () => clearInterval(timer);
//   }, [status, prepTime, timeLeft]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const timeColor =
//     timeLeft === 0
//       ? "text-red-500 animate-pulse"
//       : timeLeft < 300
//       ? "text-yellow-500"
//       : "text-blue-500 dark:text-blue-400";

//   return (
//     <span className={`font-mono font-semibold ${timeColor}`}>
//       {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
//     </span>
//   );
// };

// // ====================================================================
// //  Kitchen Card Component
// // ====================================================================
// interface KitchenCardProps {
//   order: Order;
//   onSetPrepTime: (orderId: number, time: number) => void;
//   onCompleteCooking: (orderId: number) => void;
//   onOrderServed: (orderId: number) => void;
// }

// const KitchenCard: FC<KitchenCardProps> = ({
//   order,
//   onSetPrepTime,
//   onCompleteCooking,
//   onOrderServed,
// }) => {
//   const [prepTime, setPrepTime] = useState("");
//   const totalItems = useMemo(
//     () => order.order_items.reduce((acc, item) => acc + item.quantity, 0),
//     [order.order_items]
//   );

//   const cardVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, scale: 0.95 },
//   };

//   const statusConfig = {
//     accepted: {
//       icon: Bell,
//       color: "border-yellow-500",
//       iconColor: "text-yellow-500",
//     },
//     preparing: {
//       icon: Utensils,
//       color: "border-blue-500",
//       iconColor: "text-blue-500",
//     },
//     ready: {
//       icon: Sparkles,
//       color: "border-purple-500",
//       iconColor: "text-purple-500",
//     },
//   };

//   const currentStatus = statusConfig[
//     order.status as keyof typeof statusConfig
//   ] || { icon: ChefHat, color: "border-gray-400", iconColor: "text-gray-400" };

//   return (
//     <motion.div
//       layout
//       variants={cardVariants}
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       className="mb-4"
//     >
//       <Card
//         className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-card/90 backdrop-blur-sm border-l-4 ${currentStatus.color}`}
//       >
//         <CardHeader className="p-4 border-b border-border/60">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-3">
//               <currentStatus.icon
//                 className={`h-5 w-5 ${currentStatus.iconColor}`}
//               />
//               <CardTitle className="text-md font-bold text-primary">
//                 #{order.publicId.slice(0, 6)}
//                 <span className="text-sm font-medium text-muted-foreground ml-2">
//                   T{order.tableNo}
//                 </span>
//               </CardTitle>
//             </div>
//             <Badge
//               variant="secondary"
//               className="text-sm py-1 px-3 rounded-full"
//             >
//               {totalItems} items
//             </Badge>
//           </div>
//           <p className="text-xs text-muted-foreground pt-2">
//             {new Date(order.created_at).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </p>
//         </CardHeader>

//         <CardContent className="p-4 space-y-4">
//           <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
//             {order.order_items.map((item) => (
//               <li key={item.id} className="text-sm flex items-center">
//                 <span className="font-bold text-primary mr-3 bg-primary/10 h-6 w-6 flex items-center justify-center rounded-full text-xs">
//                   {item.quantity}x
//                 </span>
//                 <span className="text-foreground flex-grow truncate">
//                   {item.item.name}
//                 </span>
//                 {item.variant && (
//                   <span className="text-muted-foreground ml-2 text-xs">
//                     ({item.variant.name})
//                   </span>
//                 )}
//               </li>
//             ))}
//           </ul>

//           <div className="pt-2">
//             {order.status === "accepted" && (
//               <div className="flex gap-2">
//                 <Select onValueChange={setPrepTime} value={prepTime}>
//                   <SelectTrigger className="h-9 rounded-lg text-xs w-full">
//                     <SelectValue placeholder="Set Prep Time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[5, 10, 15, 20, 25, 30].map((t) => (
//                       <SelectItem key={t} value={String(t)}>
//                         {t} min
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Button
//                   size="sm"
//                   className="h-9 rounded-lg bg-green-600 hover:bg-green-700 text-white"
//                   disabled={!prepTime}
//                   onClick={() => onSetPrepTime(order.id, parseInt(prepTime))}
//                 >
//                   <Clock className="h-4 w-4 mr-1.5" /> Start
//                 </Button>
//               </div>
//             )}
//             {order.status === "preparing" && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="w-full h-10 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
//                   >
//                     <Timer className="h-5 w-5 mr-2" />
//                     <TimerComponent
//                       prepTime={order.prepTime || 10}
//                       status={order.status}
//                     />
//                     <span className="mx-3 text-muted-foreground">|</span>
//                     <span className="font-semibold">Ready?</span>
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Is this order ready for serving?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Confirming will move Order #{order.publicId.slice(0, 6)}{" "}
//                       to the 'Ready' list.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Not Yet</AlertDialogCancel>
//                     <AlertDialogAction
//                       className="bg-blue-600 hover:bg-blue-700"
//                       onClick={() => onCompleteCooking(order.id)}
//                     >
//                       Yes, It's Ready
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//             {order.status === "ready" && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     size="lg"
//                     className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white"
//                   >
//                     <PartyPopper className="h-5 w-5 mr-2" /> Mark as Served
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Has this order been served to the customer?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will complete the order and remove it from the
//                       display.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>No</AlertDialogCancel>
//                     <AlertDialogAction
//                       className="bg-purple-600 hover:bg-purple-700"
//                       onClick={() => onOrderServed(order.id)}
//                     >
//                       Yes, Served!
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// // ====================================================================
// //  Order Column & Main Dashboard
// // ====================================================================
// const OrderColumn: FC<{
//   title: string;
//   orders: Order[];
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }> = ({ title, orders, icon, children }) => (
//   <div className="flex flex-col w-full bg-slate-100/50 dark:bg-slate-900/50 rounded-xl">
//     <div className="sticky top-0 z-10 p-3 bg-slate-100 dark:bg-slate-900 rounded-t-xl shadow-sm">
//       <div className="flex items-center gap-3">
//         {icon}
//         <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">
//           {title}
//         </h2>
//         <Badge variant="secondary">{orders.length}</Badge>
//       </div>
//     </div>
//     <div className="p-2 sm:p-3 h-full overflow-y-auto">
//       {orders.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-sm py-10">
//           <Inbox className="h-10 w-10 mb-4 text-gray-400" />
//           <p className="font-semibold">All caught up!</p>
//           <p>No orders in this section.</p>
//         </div>
//       ) : (
//         <AnimatePresence>{children}</AnimatePresence>
//       )}
//     </div>
//   </div>
// );

// export default function KitchenDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [cafeId] = useState<string>("1");
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let socket: Socket;

//     const setupSocket = () => {
//       socket = io(
//         process.env.NEXT_PUBLIC_BACKEND_API_KITCHEN_URL ||
//           "http://localhost:5000",
//         {
//           reconnectionAttempts: 5,
//           reconnectionDelay: 5000,
//           query: { cafeId },
//         }
//       );

//       socket.on("connect", () => console.log("Socket connected"));
//       socket.on("disconnect", () => console.log("Socket disconnected"));
//       socket.on("connect_error", () =>
//         setError("Server connection failed. Retrying...")
//       );

//       socket.on("new_order", (newOrder: Order) =>
//         setOrders((prev) => [newOrder, ...prev])
//       );
//       socket.on("order_updated", (updatedOrder: Order) => {
//         setOrders((prev) =>
//           prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
//         );
//       });
//     };

//     const fetchOrders = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_API_KITCHEN_URL}/orders?cafeId=${cafeId}`
//         );
//         if (!response.ok)
//           throw new Error(`Network response was not ok (${response.status})`);
//         const data: Order[] = await response.json();
//         setOrders(
//           data
//             .filter((o) => o.status !== "completed")
//             .sort(
//               (a, b) =>
//                 new Date(a.created_at).getTime() -
//                 new Date(b.created_at).getTime()
//             )
//         );
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//     setupSocket();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [cafeId]);

//   const handleApiCall = async (method: "PATCH", url: string, body?: any) => {
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: body ? JSON.stringify(body) : undefined,
//       });
//       if (!response.ok) throw new Error("API call failed");
//     } catch (e: any) {
//       setError("Failed to update order. Please refresh.");
//       console.error(e);
//     }
//   };

//   const handleSetPrepTime = (orderId: number, time: number) => {
//     handleApiCall(
//       "PATCH",
//       `${process.env.NEXT_PUBLIC_BACKEND_API_KITCHEN_URL}/orders/${orderId}/prep-time`,
//       { prepTime: time }
//     );
//   };
//   const handleCompleteCooking = (orderId: number) => {
//     handleApiCall(
//       "PATCH",
//       `${process.env.NEXT_PUBLIC_BACKEND_API_KITCHEN_URL}/orders/${orderId}/complete-cooking`
//     );
//   };
//   const handleOrderServed = (orderId: number) => {
//     handleApiCall(
//       "PATCH",
//       `${process.env.NEXT_PUBLIC_BACKEND_API_KITCHEN_URL}/orders/${orderId}/serve`
//     );
//     setOrders((prev) => prev.filter((order) => order.id !== orderId)); // Optimistic update
//   };

//   const { accepted, preparing, ready } = useMemo(
//     () => ({
//       accepted: orders.filter((o) => o.status === "accepted"),
//       preparing: orders.filter((o) => o.status === "preparing"),
//       ready: orders.filter((o) => o.status === "ready"),
//     }),
//     [orders]
//   );

//   const cardHandlers = {
//     onSetPrepTime: handleSetPrepTime,
//     onCompleteCooking: handleCompleteCooking,
//     onOrderServed: handleOrderServed,
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
//         <ChefHat className="h-16 w-16 text-primary animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-slate-50 dark:bg-black/90 font-sans p-2 sm:p-4">
//       <header className="flex-shrink-0 mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <ChefHat className="h-7 w-7 text-primary" />
//           <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
//             Kitchen Display
//           </h1>
//         </div>
//         {error && (
//           <div className="bg-red-500/10 text-red-500 text-xs font-semibold p-2 rounded-lg">
//             {error}
//           </div>
//         )}
//       </header>

//       {/* Mobile View */}
//       <main className="flex-grow overflow-hidden md:hidden">
//         <Tabs defaultValue="accepted" className="h-full flex flex-col">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="accepted">New ({accepted.length})</TabsTrigger>
//             <TabsTrigger value="preparing">
//               Preparing ({preparing.length})
//             </TabsTrigger>
//             <TabsTrigger value="ready">Ready ({ready.length})</TabsTrigger>
//           </TabsList>
//           <div className="flex-grow overflow-y-auto pt-4">
//             <AnimatePresence mode="wait">
//               <TabsContent key="accepted" value="accepted">
//                 {accepted.map((order) => (
//                   <KitchenCard key={order.id} order={order} {...cardHandlers} />
//                 ))}
//               </TabsContent>
//               <TabsContent key="preparing" value="preparing">
//                 {preparing.map((order) => (
//                   <KitchenCard key={order.id} order={order} {...cardHandlers} />
//                 ))}
//               </TabsContent>
//               <TabsContent key="ready" value="ready">
//                 {ready.map((order) => (
//                   <KitchenCard key={order.id} order={order} {...cardHandlers} />
//                 ))}
//               </TabsContent>
//             </AnimatePresence>
//           </div>
//         </Tabs>
//       </main>

//       {/* Desktop View */}
//       <main className="hidden md:grid flex-grow grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
//         <OrderColumn
//           title="New"
//           orders={accepted}
//           icon={<Salad className="h-6 w-6 text-yellow-500" />}
//         >
//           {accepted.map((order) => (
//             <KitchenCard key={order.id} order={order} {...cardHandlers} />
//           ))}
//         </OrderColumn>
//         <OrderColumn
//           title="Preparing"
//           orders={preparing}
//           icon={<Utensils className="h-6 w-6 text-blue-500" />}
//         >
//           {preparing.map((order) => (
//             <KitchenCard key={order.id} order={order} {...cardHandlers} />
//           ))}
//         </OrderColumn>
//         <OrderColumn
//           title="Ready"
//           orders={ready}
//           icon={<CheckCircle className="h-6 w-6 text-purple-500" />}
//         >
//           {ready.map((order) => (
//             <KitchenCard key={order.id} order={order} {...cardHandlers} />
//           ))}
//         </OrderColumn>
//       </main>
//     </div>
//   );
// }




const page = () => {
  return (
    <div>page</div>
  )
}
export default page