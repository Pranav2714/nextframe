"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Credits() {
  const { user } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeUserCredits = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        try {
          setLoading(true);
          const email = user.emailAddresses[0].emailAddress;
          const userDocRef = doc(db, "users", email);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // Create new user document with initial credits
            await setDoc(userDocRef, {
              email: email,
              createdAt: new Date(),
              credits: 25,
            });
            setCredits(25);
            toast.success("Welcome! You've received 25 free credits");
          } else {
            // Load existing credits
            const userData = userDocSnap.data();
            setCredits(userData?.credits || 0);
          }
        } catch (error) {
          console.error("Error initializing credits:", error);
          toast.error("Failed to load credits");
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      initializeUserCredits();
    }
  }, [user]);

  const handleBuyCredits = async (amount: number) => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    try {
      setLoading(true);
      const email = user.emailAddresses[0].emailAddress;
      const userDocRef = doc(db, "users", email);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        toast.error("User account not found");
        return;
      }

      const currentCredits = userDocSnap.data()?.credits || 0;
      await updateDoc(userDocRef, {
        credits: currentCredits + amount,
      });
      setCredits(currentCredits + amount);
      toast.success(`Successfully added ${amount} credits`);
    } catch (error) {
      console.error("Credit purchase failed:", error);
      toast.error("Failed to purchase credits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Credits</h2>
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold">Available Credits</p>
            <p className="text-4xl font-bold text-primary">
              {loading ? <span className="text-sm">Loading...</span> : credits}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => handleBuyCredits(10)}
            disabled={loading}
          >
            Buy 10 Credits ($10)
          </Button>
          <Button
            className="w-full"
            onClick={() => handleBuyCredits(20)}
            disabled={loading}
          >
            Buy 20 Credits ($18)
          </Button>
          <Button
            className="w-full"
            onClick={() => handleBuyCredits(50)}
            disabled={loading}
          >
            Buy 50 Credits ($40)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Credits;
