using System.Net.Http.Headers;
using System.Net.Http.Json;
using Pirnav.API.Models;

public class EmsService
{
    private readonly HttpClient _httpClient;

    public EmsService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    // STEP 1: Get Token
    public async Task<string> GetToken()
    {
        var response = await _httpClient.PostAsJsonAsync("api/Admin/login", new
        {
            email = "admin@ems.com",
            password = "Admin@123"
        });

        var content = await response.Content.ReadAsStringAsync();
        Console.WriteLine("LOGIN RESPONSE: " + content);

        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

        if (result == null || string.IsNullOrEmpty(result.token))
        {
            throw new Exception("Failed to get token from EMS");
        }

        return result.token;
    }

    // STEP 2: Send Employee 
    public async Task<bool> SendToEms(JobApplication candidate)
    {
        var token = await GetToken();

        _httpClient.DefaultRequestHeaders.Clear();

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var emsRequest = new
        {
            employee_Id = "P" + candidate.Id,   
            name = candidate.Name,
            department = "IT",
            roleName = "Employee",              
            email = candidate.Email,
            ctc = 300000,                       
            status = "Active",
            joiningDate = DateTime.UtcNow
        };

        Console.WriteLine("TOKEN: " + token);

        var response = await _httpClient.PostAsJsonAsync("api/Employees", emsRequest);

        var result = await response.Content.ReadAsStringAsync();

        Console.WriteLine("EMS STATUS: " + response.StatusCode);
        Console.WriteLine("EMS RESPONSE: " + result);

        return response.IsSuccessStatusCode;
    }
}