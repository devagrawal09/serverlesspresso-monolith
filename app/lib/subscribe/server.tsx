import { ClientSubscription } from "./client";

export function Subscribe(props: { to: string; children?: React.ReactNode }) {
  const token = `${props.to}`;
  return (
    <ClientSubscription
      url={`wss://innovative-binary-hbxlu.ampt.app`}
      token={token}
    >
      {props.children}
    </ClientSubscription>
  );
}
