'use client'; // مهم جدًا لو بتستخدم App Router في Next.js

import { use, useState } from "react";
import Button from "@/components/Button/button";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter, usePathname } from 'next/navigation';


const Profile = dynamic(() => import('../../components/Button/profile'), {
  loading: () => <p>loading ...</p>,
  ssr: false
})
export default function Team() {
  const [x, setX] = useState(0);
  const [profile, setProfile] = useState(false)
  const router = useRouter()
  function add() {
    setX(x + 1);
    setTimeout(() => {
      router.push(`/?id=880`);

    }, 2000);

  }
  function show() {
    setProfile(true)
  }
  const pathname = usePathname()

  return (
    <>
      {/* <button onClick={add}>Add 1</button> */}
      <p>you are in {pathname}</p>

      <Button onClick={add} label="Add" />
      <Button onClick={show} label="Show profile page" />
      <h2>{x}</h2>
      <Image src={'/images/ahmed.png'} alt="image" width={200} height={300} />
      <Link href={'https://www.geeksforgeeks.org/how-to-add-stylesheet-in-next-js/'}>grrek</Link>
      {profile && <Profile />}
    </>
  );
}
