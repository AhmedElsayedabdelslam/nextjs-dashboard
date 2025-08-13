'use client';

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}


// type p2 ={
//    label:String
// }
// export default function P({label}:p2){
//     return (
//         <p style={{color:"#fff"}}>{label}</p>
//     )
// }
// type p2 = {
//   label: string; // لازم يكون بالحرف الصغير `string` مش `String`
// };

// export default function P({ label }: p2) {
//   return <p style={{ color: "#fff" }}>{label}</p>; // نسيت `return`
// }
