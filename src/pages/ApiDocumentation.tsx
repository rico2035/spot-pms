import { useEffect, useState } from 'react';
import { ClipboardCheckIcon, CodeIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';

export default function ApiDocumentation() {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  
  const apiEndpoints = [
    {
      id: 'buildings',
      name: 'Buildings',
      endpoints: [
        {
          id: 'get-buildings',
          method: 'GET',
          path: '/api/buildings',
          description: 'Get all buildings',
          parameters: [],
          responses: [
            { code: 200, description: 'Returns an array of buildings' }
          ],
          example: {
            request: '',
            response: `[
  {
    "id": "1",
    "name": "Main Garage",
    "address": "123 Main Street, New York, NY 10001",
    "description": "Main parking facility with 5 floors",
    "floorCount": 5,
    "totalSpots": 250,
    "occupiedSpots": 168
  },
  {
    "id": "2",
    "name": "West End Facility",
    "address": "456 West Avenue, New York, NY 10002",
    "description": "Secondary parking garage near downtown",
    "floorCount": 3,
    "totalSpots": 120,
    "occupiedSpots": 76
  }
]`
          }
        },
        {
          id: 'get-building',
          method: 'GET',
          path: '/api/buildings/{id}',
          description: 'Get a single building by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, type: 'string', description: 'Building ID' }
          ],
          responses: [
            { code: 200, description: 'Returns the building data' },
            { code: 404, description: 'Building not found' }
          ],
          example: {
            request: '',
            response: `{
  "id": "1",
  "name": "Main Garage",
  "address": "123 Main Street, New York, NY 10001",
  "description": "Main parking facility with 5 floors",
  "floorCount": 5,
  "totalSpots": 250,
  "occupiedSpots": 168
}`
          }
        },
        {
          id: 'create-building',
          method: 'POST',
          path: '/api/buildings',
          description: 'Create a new building',
          parameters: [
            { name: 'name', in: 'body', required: true, type: 'string', description: 'Building name' },
            { name: 'address', in: 'body', required: false, type: 'string', description: 'Building address' },
            { name: 'description', in: 'body', required: false, type: 'string', description: 'Building description' }
          ],
          responses: [
            { code: 201, description: 'Building created successfully' },
            { code: 400, description: 'Invalid input' }
          ],
          example: {
            request: `{
  "name": "North Side Garage",
  "address": "789 North Street, New York, NY 10003",
  "description": "New garage in North district"
}`,
            response: `{
  "id": "3",
  "name": "North Side Garage",
  "address": "789 North Street, New York, NY 10003",
  "description": "New garage in North district",
  "floorCount": 0,
  "totalSpots": 0,
  "occupiedSpots": 0
}`
          }
        }
      ]
    },
    {
      id: 'floors',
      name: 'Floors',
      endpoints: [
        {
          id: 'get-floors',
          method: 'GET',
          path: '/api/buildings/{buildingId}/floors',
          description: 'Get all floors for a building',
          parameters: [
            { name: 'buildingId', in: 'path', required: true, type: 'string', description: 'Building ID' }
          ],
          responses: [
            { code: 200, description: 'Returns an array of floors' }
          ],
          example: {
            request: '',
            response: `[
  {
    "id": "f1",
    "buildingId": "1",
    "floorNumber": 1,
    "description": "Ground Floor"
  },
  {
    "id": "f2",
    "buildingId": "1",
    "floorNumber": 2,
    "description": null
  }
]`
          }
        },
        {
          id: 'create-floor',
          method: 'POST',
          path: '/api/buildings/{buildingId}/floors',
          description: 'Create a new floor',
          parameters: [
            { name: 'buildingId', in: 'path', required: true, type: 'string', description: 'Building ID' },
            { name: 'floorNumber', in: 'body', required: true, type: 'number', description: 'Floor number' },
            { name: 'description', in: 'body', required: false, type: 'string', description: 'Floor description' }
          ],
          responses: [
            { code: 201, description: 'Floor created successfully' },
            { code: 400, description: 'Invalid input' },
            { code: 404, description: 'Building not found' }
          ],
          example: {
            request: `{
  "floorNumber": 3,
  "description": "Premium Level"
}`,
            response: `{
  "id": "f7",
  "buildingId": "1",
  "floorNumber": 3,
  "description": "Premium Level"
}`
          }
        }
      ]
    },
    {
      id: 'bays',
      name: 'Bays',
      endpoints: [
        {
          id: 'get-bays',
          method: 'GET',
          path: '/api/floors/{floorId}/bays',
          description: 'Get all bays for a floor',
          parameters: [
            { name: 'floorId', in: 'path', required: true, type: 'string', description: 'Floor ID' }
          ],
          responses: [
            { code: 200, description: 'Returns an array of bays' }
          ],
          example: {
            request: '',
            response: `[
  {
    "id": "b1",
    "floorId": "f1",
    "bayNumber": 1,
    "description": "Section A"
  },
  {
    "id": "b2",
    "floorId": "f1",
    "bayNumber": 2,
    "description": "Section B"
  }
]`
          }
        }
      ]
    },
    {
      id: 'spots',
      name: 'Spots',
      endpoints: [
        {
          id: 'get-spots',
          method: 'GET',
          path: '/api/bays/{bayId}/spots',
          description: 'Get all spots for a bay',
          parameters: [
            { name: 'bayId', in: 'path', required: true, type: 'string', description: 'Bay ID' }
          ],
          responses: [
            { code: 200, description: 'Returns an array of spots' }
          ],
          example: {
            request: '',
            response: `[
  {
    "id": "spot_b1_1",
    "bayId": "b1",
    "spotNumber": 1,
    "type": "standard",
    "status": "available",
    "features": ["ev_charging"],
    "lastUpdated": "2023-11-01T14:23:45.000Z"
  },
  {
    "id": "spot_b1_2",
    "bayId": "b1",
    "spotNumber": 2,
    "type": "compact",
    "status": "occupied",
    "features": [],
    "lastUpdated": "2023-11-01T15:10:22.000Z"
  }
]`
          }
        },
        {
          id: 'update-spot-status',
          method: 'PATCH',
          path: '/api/spots/{spotId}/status',
          description: 'Update a spot\'s status',
          parameters: [
            { name: 'spotId', in: 'path', required: true, type: 'string', description: 'Spot ID' },
            { name: 'status', in: 'body', required: true, type: 'string', description: 'New status (available, occupied, reserved, maintenance)' }
          ],
          responses: [
            { code: 200, description: 'Spot status updated successfully' },
            { code: 400, description: 'Invalid status' },
            { code: 404, description: 'Spot not found' }
          ],
          example: {
            request: `{
  "status": "maintenance"
}`,
            response: `{
  "id": "spot_b1_1",
  "bayId": "b1",
  "spotNumber": 1,
  "type": "standard",
  "status": "maintenance",
  "features": ["ev_charging"],
  "lastUpdated": "2023-11-02T09:45:12.000Z"
}`
          }
        }
      ]
    },
    {
      id: 'cars',
      name: 'Cars',
      endpoints: [
        {
          id: 'check-in-car',
          method: 'POST',
          path: '/api/cars/checkin',
          description: 'Check in a car',
          parameters: [
            { name: 'licensePlate', in: 'body', required: true, type: 'string', description: 'License plate number' },
            { name: 'buildingId', in: 'body', required: true, type: 'string', description: 'Building ID' }
          ],
          responses: [
            { code: 200, description: 'Car checked in successfully' },
            { code: 400, description: 'Invalid input or car already checked in' },
            { code: 404, description: 'Building not found or no available spots' }
          ],
          example: {
            request: `{
  "licensePlate": "ABC1234",
  "buildingId": "1"
}`,
            response: `{
  "id": "car123",
  "licensePlate": "ABC1234",
  "buildingId": "1",
  "spotId": "spot_b1_5",
  "checkInTime": "2023-11-02T10:15:30.000Z",
  "checkOutTime": null
}`
          }
        },
        {
          id: 'check-out-car',
          method: 'POST',
          path: '/api/cars/checkout',
          description: 'Check out a car',
          parameters: [
            { name: 'licensePlate', in: 'body', required: true, type: 'string', description: 'License plate number' }
          ],
          responses: [
            { code: 200, description: 'Car checked out successfully' },
            { code: 404, description: 'Car not found or already checked out' }
          ],
          example: {
            request: `{
  "licensePlate": "ABC1234"
}`,
            response: `{
  "id": "record123",
  "carId": "car123",
  "licensePlate": "ABC1234",
  "buildingId": "1",
  "spotId": "spot_b1_5",
  "checkInTime": "2023-11-02T10:15:30.000Z",
  "checkOutTime": "2023-11-02T14:25:10.000Z",
  "fee": 20.00
}`
          }
        },
        {
          id: 'search-car',
          method: 'GET',
          path: '/api/cars/search',
          description: 'Search for a car by license plate',
          parameters: [
            { name: 'licensePlate', in: 'query', required: true, type: 'string', description: 'License plate to search for' }
          ],
          responses: [
            { code: 200, description: 'Returns car data if found' },
            { code: 404, description: 'Car not found' }
          ],
          example: {
            request: '',
            response: `{
  "car": {
    "id": "car123",
    "licensePlate": "ABC1234",
    "buildingId": "1",
    "spotId": "spot_b1_5",
    "checkInTime": "2023-11-02T10:15:30.000Z",
    "checkOutTime": null
  },
  "history": [
    {
      "id": "record122",
      "carId": "car123",
      "licensePlate": "ABC1234",
      "buildingId": "1",
      "spotId": "spot_b1_3",
      "checkInTime": "2023-10-30T08:20:15.000Z",
      "checkOutTime": "2023-10-30T17:05:22.000Z",
      "fee": 25.00
    }
  ]
}`
          }
        }
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      endpoints: [
        {
          id: 'occupancy-report',
          method: 'GET',
          path: '/api/reports/occupancy',
          description: 'Get occupancy report',
          parameters: [
            { name: 'buildingId', in: 'query', required: false, type: 'string', description: 'Building ID (optional)' },
            { name: 'startDate', in: 'query', required: false, type: 'string', description: 'Start date in ISO format' },
            { name: 'endDate', in: 'query', required: false, type: 'string', description: 'End date in ISO format' }
          ],
          responses: [
            { code: 200, description: 'Returns occupancy data' }
          ],
          example: {
            request: '',
            response: `{
  "overall": {
    "averageOccupancy": 72.5,
    "peakTime": "2023-10-31T18:30:00.000Z",
    "peakOccupancy": 87.2
  },
  "daily": [
    {
      "date": "2023-10-30",
      "averageOccupancy": 68.3,
      "peak": {
        "time": "08:30:00",
        "value": 81.0
      }
    },
    {
      "date": "2023-10-31",
      "averageOccupancy": 76.7,
      "peak": {
        "time": "18:30:00",
        "value": 87.2
      }
    }
  ]
}`
          }
        }
      ]
    }
  ];

  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Documentation</h2>
        <p className="text-neutral-500">Reference for the Spot Parking Management System API</p>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-medium mb-4">Authentication</h3>
          <p className="mb-4">All API requests require authentication using an API key.</p>
          <div className="bg-neutral-50 p-4 rounded-md mb-4">
            <p className="text-sm mb-2 font-medium">Example Request Header:</p>
            <div className="bg-neutral-900 text-neutral-100 p-3 rounded-md text-sm font-mono relative">
              <pre className="overflow-x-auto">Authorization: Bearer YOUR_API_KEY</pre>
              <button
                className="absolute top-2 right-2 text-neutral-400 hover:text-white"
                onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
              >
                <ClipboardCheckIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500">
            <h4 className="text-yellow-800 font-medium mb-1">Important</h4>
            <p className="text-yellow-700 text-sm">
              Keep your API key secure. Don't commit it to version control or share it in public repositories.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="card-header">
              <h3 className="text-lg font-medium">Endpoints</h3>
            </div>
            <div className="p-2">
              <nav className="space-y-1">
                {apiEndpoints.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h4 className="px-3 py-2 text-sm font-medium text-neutral-900">{category.name}</h4>
                    <div className="space-y-1">
                      {category.endpoints.map((endpoint) => (
                        <button
                          key={endpoint.id}
                          onClick={() => setActiveEndpoint(endpoint.id)}
                          className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                            activeEndpoint === endpoint.id
                              ? 'bg-primary-50 text-primary-700 font-medium'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span className={`inline-block w-16 font-mono ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          {endpoint.path.split('/').pop()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {apiEndpoints.flatMap((category) => 
            category.endpoints.filter((endpoint) => 
              !activeEndpoint || endpoint.id === activeEndpoint
            )
          ).map((endpoint) => (
            <div key={endpoint.id} className="card" id={endpoint.id}>
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center">
                  <span className={`inline-block py-1 px-2 rounded text-sm font-mono mr-2 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono">{endpoint.path}</span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}
                  icon={<ClipboardCheckIcon className="h-4 w-4" />}
                >
                  Copy
                </Button>
              </div>
              <div className="card-body">
                <p className="mb-4">{endpoint.description}</p>

                {endpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">In</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Required</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {endpoint.parameters.map((param, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm font-mono text-neutral-900">{param.name}</td>
                              <td className="px-4 py-2 text-sm text-neutral-500">{param.in}</td>
                              <td className="px-4 py-2 text-sm text-neutral-500">{param.type}</td>
                              <td className="px-4 py-2 text-sm text-neutral-500">
                                {param.required ? (
                                  <span className="text-green-600">Yes</span>
                                ) : (
                                  <span className="text-neutral-500">No</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-neutral-500">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Responses</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Code</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {endpoint.responses.map((response, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm font-mono text-neutral-900">{response.code}</td>
                            <td className="px-4 py-2 text-sm text-neutral-500">{response.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Example</h4>
                  
                  {endpoint.example.request && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-500 mb-1">Request Body:</p>
                        <button
                          className="text-xs text-primary-600 hover:text-primary-700"
                          onClick={() => copyToClipboard(endpoint.example.request)}
                        >
                          <span className="flex items-center">
                            <ClipboardCheckIcon className="h-3 w-3 mr-1" />
                            Copy
                          </span>
                        </button>
                      </div>
                      <div className="bg-neutral-900 text-neutral-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                        <pre>{endpoint.example.request || 'No request body required'}</pre>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500 mb-1">Response:</p>
                      <button
                        className="text-xs text-primary-600 hover:text-primary-700"
                        onClick={() => copyToClipboard(endpoint.example.response)}
                      >
                        <span className="flex items-center">
                          <ClipboardCheckIcon className="h-3 w-3 mr-1" />
                          Copy
                        </span>
                      </button>
                    </div>
                    <div className="bg-neutral-900 text-neutral-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{endpoint.example.response}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!activeEndpoint && apiEndpoints.length > 0 && (
            <div className="card">
              <div className="card-body text-center py-12">
                <CodeIcon className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium text-neutral-700">Select an Endpoint</h3>
                <p className="text-neutral-500 mt-2">Choose an endpoint from the sidebar to view its documentation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-800';
    case 'POST':
      return 'bg-green-100 text-green-800';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800';
    case 'PATCH':
      return 'bg-purple-100 text-purple-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}