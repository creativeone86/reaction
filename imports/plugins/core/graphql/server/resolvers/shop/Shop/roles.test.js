import { xformRolesResponse } from "@reactioncommerce/reaction-graphql-xforms/roles";
import rolesResolver from "./roles";
import getFakeMongoCursor from "/imports/test-utils/helpers/getFakeMongoCursor";

const base64ID = "cmVhY3Rpb24vc2hvcDoxMjM="; // reaction/shop:123

const mockRoles = [
  { _id: "a1", name: "admin" },
  { _id: "b2", name: "foo" },
  { _id: "c3", name: "bar" }
];

const mockRolesQuery = getFakeMongoCursor("Tags", mockRoles);

const transformedRoles = mockRoles.map(xformRolesResponse);

test("calls queries.tags and returns a partial connection", async () => {
  const roles = jest.fn().mockName("roles").mockReturnValueOnce(Promise.resolve(mockRolesQuery));

  const result = await rolesResolver({ _id: base64ID }, {}, {
    queries: { roles }
  });

  expect(result).toEqual({
    nodes: transformedRoles,
    pageInfo: {
      endCursor: "cmVhY3Rpb24vcm9sZTpjMw==",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "cmVhY3Rpb24vcm9sZTphMQ=="
    },
    totalCount: 3
  });

  expect(roles).toHaveBeenCalled();
  expect(roles.mock.calls[0][1]).toBe("123");
});