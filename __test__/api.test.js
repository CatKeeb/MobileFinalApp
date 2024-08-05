import axios from "axios";
import { searchRestaurants } from "../src/services/api";

jest.mock("axios");

describe("searchRestaurants", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a GET request with the right parameters", async () => {
    const mockResponse = { data: { businesses: [] } };
    axios.get.mockResolvedValue(mockResponse);

    const term = "pizza";
    const location = "New York";
    const offset = 10;

    await searchRestaurants(term, location, offset);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/search"), {
      params: { term, location, offset },
    });
  });

  it("should return the data from the API", async () => {
    const mockResponse = {
      data: { businesses: [{ id: "1", name: "Test Restaurant" }] },
    };
    axios.get.mockResolvedValue(mockResponse);

    const result = await searchRestaurants("burger", "Chicago");

    expect(result).toEqual(mockResponse);
  });

  it("should use default offset of 0 if not provided", async () => {
    const mockResponse = { data: { businesses: [] } };
    axios.get.mockResolvedValue(mockResponse);

    await searchRestaurants("sushi", "Singapore");

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/search"), {
      params: { term: "sushi", location: "Singapore", offset: 0 },
    });
  });

  it("should throw an error if the API call fails", async () => {
    const mockError = new Error("API Error");
    axios.get.mockRejectedValue(mockError);

    await expect(searchRestaurants("tacos", "San Francisco")).rejects.toThrow(
      "API Error"
    );
  });

  it("should log the error to console.error if the API call fails", async () => {
    const mockError = new Error("API Error");
    axios.get.mockRejectedValue(mockError);

    console.error = jest.fn();

    await expect(searchRestaurants("tacos", "San Francisco")).rejects.toThrow(
      "API Error"
    );

    expect(console.error).toHaveBeenCalledWith("API Error:", mockError);
  });
});
