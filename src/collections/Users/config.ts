import { CollectionConfig, Field } from 'payload'

const contactInformation: Field = {
  name: 'userContact',
  type: 'group',
  interfaceName: 'UserContact',
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: false,
    },
  ],
  required: false,
}

const userInformation: Field = {
  name: 'userInformation',
  type: 'group',
  interfaceName: 'UserInformation',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
      ],
    },
    {
      name: 'DOB',
      type: 'date',
      required: true,
    },
  ],
  required: false,
}

const citizenshipDocument: Field = {
  name: 'citizenshipDocument',
  type: 'group',
  interfaceName: 'CitizenshipDocument',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'documentType',
          type: 'select',
          options: [
            {
              label: 'Passport',
              value: 'PASSPORT',
            },
            {
              label: 'KTP',
              value: 'KTP',
            },
          ],
          required: true,
          defaultValue: 'KTP',
        },
        {
          name: 'documentID',
          type: 'text',
          required: true,
          defaultValue: '',
        },
        {
          name: 'isVerified',
          type: 'checkbox',
          label: 'Verify Document?',
          defaultValue: false,
          hidden: true,
        },
        {
          name: 'verificationRequest',
          type: 'checkbox',
          label: 'Verification Request',
          defaultValue: false,
          hidden: true,
        },
      ],
    },
  ],
  required: false,
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/payload/ui/collections/users/userSettings.tsx'],
      },
    },
  },
  auth: false,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'clerkID',
          type: 'text',
          required: true,
        },
        {
          name: 'fullName',
          type: 'text',
          hooks: {
            beforeChange: [({ siblingData }) => delete siblingData.fullName],
            afterRead: [
              ({ data }) => {
                return `${data?.userInformation?.firstName} ${data?.userInformation?.lastName}`
              },
            ],
          },
          required: false,
        },
        {
          name: 'isSuspended',
          type: 'checkbox',
          defaultValue: false,
          required: true,
          label: 'Suspend Account?',
          hidden: true,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Information',
          fields: [userInformation, citizenshipDocument],
        },
        {
          label: 'Contact',
          fields: [contactInformation],
        },
        {
          label: 'Admin Account',
          fields: [
            {
              type: 'join',
              collection: 'admins',
              on: 'user',
              name: 'adminAccount',
              maxDepth: 3,
              hasMany: false,
            },
          ],
        },
      ],
    },
  ],
}
