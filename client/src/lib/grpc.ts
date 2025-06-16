import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { useQuery } from "@tanstack/react-query";
import { create } from "@bufbuild/protobuf";

import { Greeter } from "./gen/helloworld_pb.js";
import { HelloRequestSchema } from "./gen/helloworld_pb.js";

export const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:50051",
  
});

export const greeterClient = createClient(Greeter, transport);
console.log(transport);

export const useGreeting = (name: string) => {
  return useQuery({
    queryKey: ["greeting", name],
    queryFn: async () => {
      const request = create(HelloRequestSchema, { name });
      const response = await greeterClient.sayHello(request);
      return response;
    },
    enabled: !!name,
  });
};
